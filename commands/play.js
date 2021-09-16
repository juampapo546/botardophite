const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  joinVoiceChannel,
  createAudioResource,
  createAudioPlayer,
  AudioPlayerStatus,
  NoSubscriberBehavior,
  StreamType,
  entersState,
} = require("@discordjs/voice");

const yt = require("ytdl-core");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Searches or reads url to play your favourite music!"),
  async execute({ interaction, client }) {
    const channel = interaction.member.voice.channel;
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer();
    const resource = createAudioResource(
      "/Users/juampi/Documents/programacion/botardophiteV2/music.mp3",
      {
        metadata: {
          title: "A good song!",
        },
        inputType: StreamType.Arbitrary,
      }
    );
    player.play(resource);
    connection.subscribe(player);
    player.on(AudioPlayerStatus.AutoPaused, (data) => {
      console.log(data.audioPlayer);
    });
    connection.on("stateChange", (oldState, newState) => {
      console.log("puto");
      console.log(
        `Connection transitioned from ${oldState.status} to ${newState.status}`
      );
    });

    player.on("stateChange", (oldState, newState) => {
      console.log(
        `Audio player transitioned from ${oldState.status} to ${newState.status}`
      );
    });

    player.on("error", (error) => {
      console.error(
        "Error:",
        error.message,
        "with track",
        error.resource.metadata.title
      );
    });
  },
};
