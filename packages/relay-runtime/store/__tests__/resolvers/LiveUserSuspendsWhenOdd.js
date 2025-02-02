/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow strict-local
 * @emails oncall+relay
 */

'use strict';

import type {DataID} from 'relay-runtime';
import type {CounterSuspendsWhenOdd$key} from './__generated__/CounterSuspendsWhenOdd.graphql';
import type {LiveState} from 'relay-runtime/store/experimental-live-resolvers/LiveResolverStore';

const {GLOBAL_STORE, Selectors} = require('./ExampleExternalStateStore');
const {graphql} = require('relay-runtime');
const {
  suspenseSentinel,
} = require('relay-runtime/store/experimental-live-resolvers/LiveResolverSuspenseSentinel');
const {readFragment} = require('relay-runtime/store/ResolverFragments');

/**
 * @RelayResolver
 * @fieldName live_user_suspends_when_odd
 * @edgeTo User
 * @onType Query
 * @live
 */
function resolver(): LiveState<DataID> {
  return {
    read() {
      const number = Selectors.getNumber(GLOBAL_STORE.getState());
      if (number % 2 !== 0) {
        return suspenseSentinel();
      } else {
        return String(number);
      }
    },
    subscribe(cb): () => void {
      return GLOBAL_STORE.subscribe(cb);
    },
  };
}

module.exports = resolver;
