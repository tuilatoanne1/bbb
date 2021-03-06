module.exports.config = {
	name: "leave",
	eventType: ["log:unsubscribe"],
	version: "1.0.0",
	credits: "SpermLord",
	description: "Listen events"
};

module.exports.run = async function({ api, event, Users, Threads, client }) {
	let msg, formPush
	const { createReadStream, existsSync, mkdirSync } = require("fs-extra");
	if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;
	let settings = client.threadSetting.get(event.threadID) || {};
	let name = (await Users.getData(event.logMessageData.leftParticipantFbId)).name || (await api.getUserInfo(event.logMessageData.leftParticipantFbId))[event.logMessageData.leftParticipantFbId].name
	let type = (event.author == event.logMessageData.leftParticipantFbId) ? "π©πͺΜΜ£ ππͺΜπ©" : "ππΜ£ π¦πͺπΜπ£ π©π§πΜ£ π«ππΜπ£ Δπͺπ€ΜΜπ";
	(typeof settings.customLeave == "undefined") ? msg = "πΎπ€π£ π«π€ΜΜ£  {name} π«πΜ π ππ€Μπ£π π©πΜπ£ Δπ€ΜΜ ππ’ π£πΜπ€ π£πΜπ£ ΔπΜ {type} π ππ€Μπ π£ππ€Μπ’, ππΜπ£π πππΜ£Μπ© ππ’ π£ππΜ β€" : msg = settings.customLeave;
	msg = msg
	.replace(/\{name}/g, name)
	.replace(/\{type}/g, type);
	let dirGif = __dirname + `/cache/leaveGif/`;
	if (existsSync(dirGif)) mkdirSync(dirGif, { recursive: true })
	if (existsSync(dirGif + `bye.mp4`)) formPush = { body: msg, attachment: createReadStream(dirGif + `bye.mp4`) }
	else formPush = { body: msg }
	return api.sendMessage(formPush, event.threadID);
}
