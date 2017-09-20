import { all } from 'redux-saga/effects';
import WS from './crypto';
import Error from './error';

export default function* () {
  yield all([
    WS(),
    Error(),
  ]);
}
