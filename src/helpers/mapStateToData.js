import store from "@store"
import isEqual from "lodash/isEqual"
import get from "lodash/get"
import { Observable } from "rxjs"
import { map, skip, distinctUntilChanged, startWith } from "rxjs/operators"


const state$ = new Observable(subscriber => {
    const unsubscribe = store.subscribe(() => {
        subscriber.next(store.getState().game);
    });
    return unsubscribe;
});

export default function mapStateToData(path, fn, {init=true}={}){
    state$.pipe(
        map(state => get(state, path)),
        startWith(get(store.getState().game, path)),
        distinctUntilChanged(isEqual),
        skip(init ? 0 : 1)
    ).subscribe(d => fn(d));
}