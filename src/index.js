/* @flow */

import type { Source } from "@capnp-js/transform";

const EMPTY = new Uint8Array(0);

export interface Readable {
  once(event: "readable", listener: () => void): mixed;
  read(): Uint8Array | null;
}

export default function readable(readable_: Readable): Source<Uint8Array> {
  return function (abort: null | true, put: (done: null | (true | Error), value: Uint8Array) => void): void {
    // #if _DEBUG
    console.log("registering for a single readable event");
    // #endif

    readable_.once("readable", () => {
      const chunk = readable_.read();
      if (chunk) {
        // #if _DEBUG
        console.log("reading");
        // #endif

        put(null, chunk);
      } else {
        // #if _DEBUG
        console.log("done reading");
        // #endif

        put(true, EMPTY);
      }
    });
  };
}
