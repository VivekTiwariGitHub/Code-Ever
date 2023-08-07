import { HubConnectionBuilder } from '@microsoft/signalr';

const signalRService = {
    startConnection: () => {
        const connection = new HubConnectionBuilder()
            .withUrl('/doorHub') // The URL of your SignalR hub endpoint
            .withAutomaticReconnect()
            .build();
        return connection;
    },
};

export default signalRService;
