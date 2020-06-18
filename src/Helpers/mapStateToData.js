import store from "@store"
import isEqual from "lodash/isEqual"
import get from "lodash/get"
import { from } from "rxjs"
import { map, skip, distinctUntilChanged, startWith } from "rxjs/operators"


const state$ = from(store);

export default function mapStateToData(path, fn, {init=true, type="game"}={}){
    state$.pipe(
        map(state => get(state[type], path)),
        startWith(get(store.getState().game, path)),
        distinctUntilChanged(isEqual),
        skip(init ? 0 : 1)
    ).subscribe(d => fn(d));
}