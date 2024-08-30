import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import { bucket } from './firebase-config';
import { socketIo } from '../app';

const uploadFileToFirebase = (filePath: any, destination: any) => {
  return new Promise((resolve, reject) => {
    const fileName = path.basename(filePath);
    const file = bucket.file(destination);

    fs.createReadStream(filePath)
      .pipe(
        file.createWriteStream({
          metadata: {
            contentType: destination.endsWith('.m3u8')
              ? 'application/x-mpegurl'
              : 'application/octet-stream',
          },
        })
      )
      .on('finish', () => {
        // io.to(productId).emit('received_message', { message: b });
        fs.unlinkSync(filePath); // Delete local file after upload
        resolve('success');
      })
      .on('error', (err: any) => {
        console.error(`Failed to upload ${destination}:`, err);
        reject(err);
      });
  });
};

export const convertToHLSAndUpload = async (
  inputPath: any,
  filePath: any,
  filename: any
) => {
  const tempDir = path.join(__dirname, 'temp');

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        '-preset ultrafast',
        '-filter_complex',
        '[0:v]fps=30,split=3[720_in][480_in][240_in];[720_in]scale=-2:720[720_out];[480_in]scale=-2:480[480_out];[240_in]scale=-2:240[240_out]',
        '-map [720_out]',
        '-map [480_out]',
        '-map [240_out]',
        '-map',
        '0:a',
        '-b:v:0 3500k',
        '-maxrate:v:0 3500k',
        '-bufsize:v:0 3500k',
        '-b:v:1 1690k',
        '-maxrate:v:1 1690k',
        '-bufsize:v:1 1690k',
        '-b:v:2 326k',
        '-maxrate:v:2 326k',
        '-bufsize:v:2 326k',
        '-b:a:0 128k',
        '-x264-params',
        'keyint=60:min-keyint=60:scenecut=0',
        '-hls_segment_type fmp4',
        '-hls_time 2',
        '-hls_list_size 0',
        '-hls_fmp4_init_filename',
        path.join(tempDir, `${filename}-%v-init.m4s`),
        '-hls_segment_filename',
        path.join(tempDir, `${filename}-%v-%03d.m4s`),
        `-master_pl_name ${filename}.m3u8`,
        '-var_stream_map',
        'a:0,agroup:a128,name:audio-128k v:0,agroup:a128,name:720p-4M v:1,agroup:a128,name:480p-2M v:2,agroup:a128,name:240p-500k',
      ])

      .output(path.join(tempDir, `${filename}-%v.m3u8`)) // Output playlist file
      .on('start', (commandLine) => {
        console.log('Spawned FFmpeg with command:', commandLine);
      })
      .on('progress', async (progress) => {
        console.log(`Processing: ${progress.percent}% done`);
        socketIo
          .to('3000')
          .emit('received_message', { message: progress.percent });
        //
      })

      .on('end', async () => {
        console.log('HLS conversion finished.');

        try {
          // Upload playlist

          // Upload all segments

          let b = 0;

          const zxc = fs
            .readdirSync(tempDir)
            .filter(
              (file) =>
                file.endsWith('init.m4s') && file.startsWith(`${filename}`)
            );
          for (const segment of zxc) {
            b++;
            await uploadFileToFirebase(
              path.join(tempDir, segment),
              `asd/temp/${segment}`
            );
          }

          const segmentFiles = fs
            .readdirSync(tempDir)
            .filter(
              (file) => file.endsWith('.m4s') && file.startsWith(filename)
            );
          for (const segment of segmentFiles) {
            b++;
            await uploadFileToFirebase(
              path.join(tempDir, segment),
              `asd/asd/${segment}`
            );
          }

          const asd = fs
            .readdirSync(tempDir)
            .filter(
              (file) => file.endsWith('.m3u8') && file.startsWith(filename)
            );

          for (const segment of asd) {
            b++;
            await uploadFileToFirebase(
              path.join(tempDir, segment),
              `asd/asd/${segment}`
            );
          }

          resolve('success');
        } catch (err) {
          reject(err);
        }
      })
      .on('error', (err) => {
        console.error('Error during conversion:', err);
        reject(err);
      })
      .run();
  });
};
