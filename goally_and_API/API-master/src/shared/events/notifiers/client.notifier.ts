import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
import { ClientsService } from 'src/entities/clients/clients.service';
import { Client } from 'src/entities/clients/schema/client.schema';
import { CLIENT_NOTIFICATIONS } from 'src/socket/const';
import { SocketBase } from 'src/socket/socket-base.gateway';
import { GoallyEventEmitter } from '../const';
import { Types } from 'mongoose';
@Injectable()
export class ClientNotifier implements OnModuleInit {
  constructor(
    @InjectEventEmitter() private readonly emitter: GoallyEventEmitter,
    private clientService: ClientsService,
    private baseSocket: SocketBase,
  ) { }

  onModuleInit() {
    this.emitter.on(
      'ClientChanged',
      async msg => await this.onClientChanged(msg),
    );
    this.emitter.on(
      'DeviceConnectedToTheChild',
      async msg => await this.onClientConnectedToTheDevice(msg),
    );
    this.emitter.on(
      'WpClientChanged',
      async clientId => await this.onWpClientChanged(clientId),
    );
  }
  async onClientChanged(msg: { client: Types.ObjectId }) {
    const clientForWebPortal = await this.clientService.findByIdFull(
      msg.client,
    );
    const clientForDevice = await this.clientService.findById(msg.client);

    if (!clientForWebPortal || !clientForDevice) return;
    this.baseSocket.sendToDeviceByClientId(
      clientForDevice._id,
      CLIENT_NOTIFICATIONS.CLIENT_CHANGED,
      { client: clientForDevice },
    );
    this.baseSocket.sendToAllParentConnectedToClient(
      clientForWebPortal._id,
      CLIENT_NOTIFICATIONS.CLIENT_CHANGED,
      clientForWebPortal,
    );
  }
  onClientConnectedToTheDevice(msg: { client: Client }) {
    const action = msg;
    this.baseSocket.sendToDeviceByClientId(
      msg.client._id,
      CLIENT_NOTIFICATIONS.CLIENT_CONFECTED_TO_DEVICE,
      action,
    );
    this.baseSocket.sendToAllParentConnectedToClient(
      msg.client._id,
      CLIENT_NOTIFICATIONS.CLIENT_CONFECTED_TO_DEVICE,
      action,
    );
  }

  async onWpClientChanged(clientId: Types.ObjectId) {
    const clientForWebPortal = await this.clientService.findByIdFull(clientId);
    console.log("clientForWebPortal", clientForWebPortal);
    if (!clientForWebPortal) return;
    this.baseSocket.sendToAllParentConnectedToClient(
      clientForWebPortal._id,
      CLIENT_NOTIFICATIONS.CLIENT_CHANGED,
      clientForWebPortal,
    );
  }
}
