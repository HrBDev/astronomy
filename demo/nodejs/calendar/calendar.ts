/*
    calendar.ts   -   Don Cross   -   2021-05-09

    A demo of using Astronomy Engine to find a series of
    interesting events for a calendar.
*/

import { AstroTime, Observer, Body, SearchRiseSet, Search } from "./astronomy";

class AstroEvent {
    constructor(
        public time: AstroTime,
        public title: string,
        public creator: AstroEventEnumerator)
        {}
}

interface AstroEventEnumerator {
    FindFirst(startTime: AstroTime): AstroEvent | null;
    FindNext(): AstroEvent | null;
}


class EventCollator implements AstroEventEnumerator {
    private eventQueue: AstroEvent[];

    constructor(private enumeratorList: AstroEventEnumerator[]) {
    }

    Append(enumerator: AstroEventEnumerator) {
        this.enumeratorList.push(enumerator);
    }

    FindFirst(startTime: AstroTime): AstroEvent | null {
        this.eventQueue = [];
        for (let enumerator of this.enumeratorList)
            this.InsertEvent(enumerator.FindFirst(startTime));
        return this.FindNext();
    }

    FindNext(): AstroEvent | null {
        if (this.eventQueue.length === 0)
            return null;

        const evt = this.eventQueue.shift();
        const another = evt.creator.FindNext();
        this.InsertEvent(another);
        return evt;
    }

    InsertEvent(evt: AstroEvent | null): void {
        if (evt !== null) {
            // Insert the event in time order -- after anything that happens before it.

            let i = 0;
            while (i < this.eventQueue.length && this.eventQueue[i].time.tt < evt.time.tt)
                ++i;

            this.eventQueue.splice(i, 0, evt);
        }
    }
}


class RiseSetEnumerator implements AstroEventEnumerator {
    private nextSearchTime: AstroTime;

    constructor(private observer: Observer, private body: Body, private direction: number, private title: string) {
    }

    FindFirst(startTime: AstroTime): AstroEvent | null {
        this.nextSearchTime = SearchRiseSet(this.body, this.observer, this.direction, startTime, 366.0);
        if (this.nextSearchTime)
            return new AstroEvent(this.nextSearchTime, this.title, this);
        return null;
    }

    FindNext(): AstroEvent | null {
        if (this.nextSearchTime) {
            const startTime = this.nextSearchTime.AddDays(0.01);
            return this.FindFirst(startTime);
        }
        return null;
    }
}


function RunTest(): void {
    const startTime = new AstroTime(new Date('2022-01-01T00:00:00Z'));
    const observer = new Observer(28.6, -81.2, 10.0);
    const collator = new EventCollator([
        new RiseSetEnumerator(observer, Body.Sun, +1, 'sunrise'),
        new RiseSetEnumerator(observer, Body.Sun, -1, 'sunset'),
        new RiseSetEnumerator(observer, Body.Moon, +1, 'moonrise'),
        new RiseSetEnumerator(observer, Body.Moon, -1, 'moonset')
    ]);

    let evt:AstroEvent = collator.FindFirst(startTime);
    while (evt !== null && evt.time.date.getUTCFullYear() === startTime.date.getUTCFullYear()) {
        console.log(`${evt.time} ${evt.title}`);
        evt = collator.FindNext();
    }
}


RunTest();
