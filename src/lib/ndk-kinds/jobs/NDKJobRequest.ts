import NDK, { NDKEvent } from "@nostr-dev-kit/ndk";

/**
 * A NIP-XX Job Request
 */
export class NDKJobRequest extends NDKEvent {
    constructor(ndk: NDK | undefined, rawEvent?: any) {
        super(ndk, rawEvent);
        this.kind = 68001;

        if (ndk) {
            this.tags.push([
                'relays',
                ...ndk.pool.urls()
            ])
        }
    }

    static from(event: NDKEvent) {
        return new NDKJobRequest(event.ndk, event.rawEvent());
    }

    /**
     * Set the job type
     *
     * @param job The job type per NIP-XX
     * @example
     *   job = 'speech-to-text';
     * @example "Specifying a model"
     *   job = ['speech-to-text', 'whisperx'];
     */
    set job(job: string | string[] | undefined) {
        if (job === undefined) {
            this.removeTag('j');
        } else {
            if (typeof job === 'string') job = [job];
            this.tags.push(['j', ...job]);
        }
    }

    get job(): string | undefined {
        const j = this.getMatchingTags('j')[0];
        return j ? j[1] : undefined;
    }

    set bid(msatAmount: number | undefined) {
        if (msatAmount === undefined) {
            this.removeTag('bid');
        } else {
            this.tags.push(['bid', msatAmount.toString()]);
        }
    }

    get bid(): number | undefined {
        const v = this.tagValue('bid');

        if (v === undefined) return undefined;

        return parseInt(v);
    }

    /**
     * Adds a new input to the job
     * @param args The arguments to the input
     */
    addInput(...args: string[]): void {
        this.tags.push(['i', ...args]);
    }

    /**
     * Adds a new parameter to the job
     */
    addParam(...args: string[]): void {
        this.tags.push(['param', ...args]);
    }

    set output(output: string | string[] | undefined) {
        if (output === undefined) {
            this.removeTag('output');
        } else {
            if (typeof output === 'string') output = [output];
            this.tags.push(['output', ...output]);
        }
    }

    get output(): string[] | undefined {
        const outputTag = this.getMatchingTags('output')[0];
        return outputTag ? outputTag.slice(1) : undefined;
    }
}