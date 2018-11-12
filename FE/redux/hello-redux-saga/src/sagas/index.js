import { put, takeEvery, call, all } from 'redux-saga/effects'
// { takeLatest } 类似节流函数，一段时间内只执行当前时间的最后一次结果
import { delay } from "redux-saga";
import axios from "axios";
import { INCREMENT_ASYNC } from "../constants/counter";

// Saga 作用函数：执行异步任务
function* incrementAsync(){
  yield call(delay ,2000);
  yield put({type:"INCREMENT"})
}

function* fetchUser(){
  const user = yield call(axios.get, "https://jsonplaceholder.typicode.com/users");
  console.log(user);
  
}
// Saga 监听函数：每次监听到 ```INCREMENT_ASYNC``` action ，都会触发一个新的异步任务
export function* watchINCREMENT_ASYNC() {
  yield takeEvery(INCREMENT_ASYNC, incrementAsync);
}

export function* watchFECTH_USER(){
  yield takeEvery("FECTH_USER_REQUEST",fetchUser)
}


// // 同时执行一个入口的多个 Sagas
export default function* rootSaga() {
  yield all([ // 并发执行
    watchFECTH_USER(),
    watchINCREMENT_ASYNC()
  ])
}