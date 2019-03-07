/* @flow */

import type { BytesR } from "@capnp-js/bytes";
import type { Source } from "@capnp-js/transform";

import { create } from "@capnp-js/bytes";

const EMPTY = create(0);

export interface Readable {
  once(event: "readable", listener: () => void): mixed;
  read(): BytesR | null;
}

export default function readable(readable_: Readable): Source<BytesR> {
  return function (abort: null | true, put: (done: null | (true | Error), value: BytesR) => void): void {
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
