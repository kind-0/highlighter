<script lang="ts">
    import PageTitle from "../PageTitle.svelte";

    export let url: string;

    function setValue(value: string) {
        url = value;
    }
</script>

<div class="max-w-7xl mx-auto w-full flex flex-col gap-8">

    <PageTitle
        title="Examples"
        subtitle="Some of the URLs Highlighter supports"
    />

    <div class="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3 gap-4">

        <button on:click={() => setValue("https://snort.social/e/note194n247lecqgcskk5rmmfgrapt4jx7ppq64xec0eca3s4ta3hwkrsex7pxa")} class="card card-bordered overflow-clip">
            <div class="card-body" >
                <div class="card-title">
                    Snort Link
                </div>

                <button class="text-primary text-left whitespace-normal">
                    snort.social/e/note194n247lecqgcskk5rmmfgrapt4jx7ppq64xec0eca3s4ta3hwkrsex7pxa
                </button>
            </div>
        </button>

        <button on:click={() => setValue("note194n247lecqgcskk5rmmfgrapt4jx7ppq64xec0eca3s4ta3hwkrsex7pxa")} class="card card-bordered overflow-clip">
            <div class="card-body" >
                <div class="card-title">
                    Kind 1 (short-note) event:
                </div>

                <button class="text-primary text-left whitespace-normal">
                    note194n247lecqgcskk5rmmfgrapt4jx7ppq64xec0eca3s4ta3hwkrsex7pxa
                </button>
            </div>
        </button>

        <button on:click={() => setValue("https://medium.com/btc24/nostr-a-decentralised-social-platform-2651930378b9")} class="card card-bordered overflow-clip image-full">
            <figure><img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*7QGMSbO7UHEa4CErZL8srg.jpeg"  class="h-32" /></figure>
            <div class="card-body" >
                <div class="card-title">
                    Medium Article
                </div>

                <button class="text-primary text-left whitespace-normal">
                    https://medium.com/btc24/nostr-a-decentralised-social-platform-2651930378b9
                </button>
            </div>
        </button>

        <button on:click={() => setValue("https://habla.news/a/naddr1qqxkuum9vd382mntv4ez6a3jqy08wumn8ghj7mn0wd68ytnnv46xsen0wfc8y6tkv93hjtnrdaksz9mhwden5te0wfjkccte9e3h2unjv4h8gtnx095szynhwden5te0wp6hyurvv4cxzeewv4eszxthwden5te0dehhxarj9eax2cn9v3jk2tnrd3hh2eqpz4mhxue69uhk2er9dchxummnw3ezumrpdejqzrthwden5te0dehhxtnvdakqzxthwden5te0wp6hyctkd9jxztnwdaehgu3wd3skueqprpmhxue69uhhyetvv9ujuumwdae8gtnnda3kjctvqy28wumn8ghj7un9d3shjtnyv9kh2uewd9hsz8thwden5te0dehhxarj9e5x7am5da3xjarrda5kutnndphhqqg4waehxw309ahx7um5wghx5ct5d5hxc6twdvq3vamnwvaz7tmpw3kxzuewdehhxarj9ekxzmnyqyf8wumn8ghj7mmxve3ksctfdch8qatzqyf8wumn8ghj7un9d3shjtnxxaazu6t0qy28wumn8ghj7un9d3shjtnwdaehgu3wvfnsz9nhwden5te0wfjkccte9ehx7um5wghxjmnxduq3uamnwvaz7tmwdaehgu3dwfjkccte9ehx76m0w3shymewvdhk6qg5waehxw309a3xcctnw3ezue3h0gh8s7t6qyfhwumn8ghj7un9d3shjctzd3jjummjvuq3samnwvaz7tmvd9nksarwd9hxwun9d3shjtnrdakszxnhwden5te0wfjkccte9ehx7um5wf5kx6r9wvhx7un8qyg8wumn8ghj7mn0wd68ytnhd9hx2qg8vdhhyctrd3jsygrlts45uj9qa8lv5caydvfumwpy386qyquc6c9zqu9fdr92sxxht5psgqqqw4rsnpf3mx")} class="card card-bordered overflow-hidden image-full">
            <figure class="h-48"><img src="https://nostr.build/i/ef18545f0e4e749cc5bad4100929b930f2be005cfc0dd47d88c56f598f6bc231.jpg" class="w-full" /></figure>
            <div class="card-body" >
                <div class="card-title">
                    Habla.news link:
                </div>



                <button class="text-primary text-left overflow-hidden">
                    https://habla.news/a/naddr1qqxkuum9vd382mntv4ez6a3jqy08wumn8ghj7mn0wd68ytnnv46xsen0wfc8y6tkv93hjtnrdaksz9mhwden5te0wfjkccte9e
                </button>
            </div>
        </button>

        <button on:click={() => setValue("naddr1qqxkuum9vd382mntv4ez6a3jqy08wumn8ghj7mn0wd68ytnnv46xsen0wfc8y6tkv93hjtnrdaksz9mhwden5te0wfjkccte9e3h2unjv4h8gtnx095szynhwden5te0wp6hyurvv4cxzeewv4eszxthwden5te0dehhxarj9eax2cn9v3jk2tnrd3hh2eqpz4mhxue69uhk2er9dchxummnw3ezumrpdejqzrthwden5te0dehhxtnvdakqzxthwden5te0wp6hyctkd9jxztnwdaehgu3wd3skueqprpmhxue69uhhyetvv9ujuumwdae8gtnnda3kjctvqy28wumn8ghj7un9d3shjtnyv9kh2uewd9hsz8thwden5te0dehhxarj9e5x7am5da3xjarrda5kutnndphhqqg4waehxw309ahx7um5wghx5ct5d5hxc6twdvq3vamnwvaz7tmpw3kxzuewdehhxarj9ekxzmnyqyf8wumn8ghj7mmxve3ksctfdch8qatzqyf8wumn8ghj7un9d3shjtnxxaazu6t0qy28wumn8ghj7un9d3shjtnwdaehgu3wvfnsz9nhwden5te0wfjkccte9ehx7um5wghxjmnxduq3uamnwvaz7tmwdaehgu3dwfjkccte9ehx76m0w3shymewvdhk6qg5waehxw309a3xcctnw3ezue3h0gh8s7t6qyfhwumn8ghj7un9d3shjctzd3jjummjvuq3samnwvaz7tmvd9nksarwd9hxwun9d3shjtnrdakszxnhwden5te0wfjkccte9ehx7um5wf5kx6r9wvhx7un8qyg8wumn8ghj7mn0wd68ytnhd9hx2qg8vdhhyctrd3jsygrlts45uj9qa8lv5caydvfumwpy386qyquc6c9zqu9fdr92sxxht5psgqqqw4rsnpf3mx")} class="card card-bordered overflow-hidden image-full">
            <figure class="h-48"><img src="https://nostr.build/i/ef18545f0e4e749cc5bad4100929b930f2be005cfc0dd47d88c56f598f6bc231.jpg" class="w-full" /></figure>
            <div class="card-body" >
                <div class="card-title">
                    NIP-23 (long-form article) event:
                </div>

                <button class="text-primary text-left overflow-hidden">
                    naddr1qqxkuum9vd382mntv4ez6a3jqy08wumn8ghj7mn0wd68ytnnv46xsen0wfc8y6tkv93hjtnrdaksz9mhwden5te0wfjkccte9e
                </button>
            </div>
        </button>

    </div>
</div>