const Youtube = require("simple-youtube-api");
// api 1
//const youtube = new Youtube("AIzaSyAMPHm6VCHUa6el51sKU05OpLkL1Ge315w");
// api 2
const youtube = new Youtube("AIzaSyAMPHm6VCHUa6el51sKU05OpLkL1Ge315w");
const yt = require("ytdl-core");

const list = [];
module.exports = {
  name: "playlist",
  description: "queue youtube playlists",
  execute(args, msg) {
    return new Promise((resolve, reject) => {
      try {
        youtube.getPlaylist(String(args)).then((playlist) => {
          console.log(`The playlist's title is ${playlist.title}`);
          playlist.getVideos().then(async (videos) => {
            for (let i = 0; i < videos.length; i++) {
              list.push({
                link: `https://www.youtube.com/watch?v=${videos[i].id}`,
                title: videos[i].title,
              });
            }

            await Promise.all(
              list.map((video) => {
                return new Promise(async (resolve, reject) => {
                  const data = await yt.getBasicInfo(video.link);
                  video.duration = parseInt(data.videoDetails.lengthSeconds);
                  resolve();
                });
              })
            );

            msg.channel.send(
              `This playlist has ${
                videos.length === 50 ? "50+" : videos.length
              } videos.`
            );
            console.log(list);
            resolve(list);
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  },
};
