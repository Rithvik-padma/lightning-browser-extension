import utils from "~/common/lib/utils";
import { getHostFromSender } from "~/common/utils/helpers";
import { MessageSignEvent, PermissionMethodNostr, Sender } from "~/types";

import state from "../../state";
import { addPermissionFor, hasPermissionFor, validateEvent } from "./helpers";

const signEventOrPrompt = async (message: MessageSignEvent, sender: Sender) => {
  const host = getHostFromSender(sender);
  if (!host) return;

  const nostr = await state.getState().getNostr();

  // check event and add an ID and pubkey if not present
  const event = message.args.event;
  if (!event.pubkey) event.pubkey = nostr.getPublicKey();
  if (!event.id) event.id = nostr.getEventHash(event);

  if (!validateEvent(event)) {
    console.error("Invalid event");
    return {
      error: "Invalid event.",
    };
  }

  try {
    const hasPermission = await hasPermissionFor(
      PermissionMethodNostr["NOSTR_SIGNMESSAGE"],
      host
    );
    if (!hasPermission) {
      const promptResponse = await utils.openPrompt<{
        enabled: boolean;
        blocked: boolean;
      }>({
        ...message,
        action: "public/nostr/confirmSignMessage",
      });

      // add permission to db only if user decided to always allow this request
      if (promptResponse.data.enabled) {
        await addPermissionFor(
          PermissionMethodNostr["NOSTR_SIGNMESSAGE"],
          host
        );
      }
    }

    const signedEvent = await nostr.signEvent(event);

    return { data: signedEvent };
  } catch (e) {
    console.error("signEvent cancelled", e);
    if (e instanceof Error) {
      return { error: e.message };
    }
  }
};

export default signEventOrPrompt;
