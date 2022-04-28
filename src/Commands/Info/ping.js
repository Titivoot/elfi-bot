module.exports = {
    name: 'ping',
    description: 'ตรวจสอบความหน่วงของบอท',
    options: [],
    execute: async (client, interaction) => {
        const startDate = Date.now();
        await interaction.reply({
            embeds: [
                {
                    title: '<a:emoji_12:849828487270367260> Loading Data...',
                    description: 'กำลังโหลดข้อมูล...',
                    color: 'RANDOM',
                    timestamp: new Date(),
                    footer: {
                        text: interaction.user.tag,
                        icon_url: interaction.member.displayAvatarURL(),
                    },
                },
            ],
        })
  
        const endDate = Date.now();
        interaction.editReply({
            embeds: [
                {
                    title: ':ping_pong: Pong!',
                    description: `Latency is ${endDate - startDate}ms.\nAPI Latency is ${Math.round(client.ws.ping)}ms.`,
                    color: 'RANDOM',
                    timestamp: new Date(),
                    footer: {
                        text: interaction.user.tag,
                        icon_url: interaction.member.displayAvatarURL(),
                    },
                },
            ],
        });
    },
};
  