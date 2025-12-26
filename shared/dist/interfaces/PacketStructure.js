"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacketType = void 0;
var PacketType;
(function (PacketType) {
    PacketType["TELEMETRY"] = "TELEMETRY";
    PacketType["COMMAND"] = "COMMAND";
    PacketType["STATUS"] = "STATUS";
    PacketType["ERROR"] = "ERROR";
    PacketType["HANDSHAKE"] = "HANDSHAKE";
})(PacketType || (exports.PacketType = PacketType = {}));
