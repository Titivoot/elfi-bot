module.exports = {
    eventName: 'ready',
    run: async (client) => {
        let activityCount = 0;

        setInterval(() => {
            const hours = new Date().getHours();
            const isDayTime = hours > 6 && hours < 20;
            if (isDayTime) client.user.setStatus("online");
            else client.user.setStatus("idle");
        }, 30 * 1000);

        setInterval(() => {
            const { Activities } = client.config;
            if (activityCount > Activities.length - 1) activityCount = 0;
            client.user.setActivity(Activities[activityCount].content, { type: Activities[activityCount].type });
            activityCount += 1;
        }, 10 * 1000);
    
        await client.application.commands.set(client.commands);
        client.logger.log(`${client.user.tag} is Ready.`, 'ready');
    }
}