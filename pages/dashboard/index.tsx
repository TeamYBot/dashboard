import classes from '../../styles/Dashboard.module.css';

import axios from "axios";
import { useState, useEffect } from "react";
import Loading from "../../components/Loading";

import type { NextPage } from "next";
import { Button, Stack, Center, Image, Link } from "@chakra-ui/react";
import { useRouter } from 'next/router';
import Head from 'next/head';

interface Guild {
    id: string;
    name: string;
    owner: boolean;
    permissions: `${bigint}`;
    icon?: string;
}

interface Response {
    mutualGuilds: Guild[];
    rest: Guild[];
}

const baseURL = "https://discord.com/api/oauth2/authorize?client_id=480926911095111682&permissions=294498200822&scope=bot"

const Dashboard: NextPage = () => {
    const [guilds, setGuilds] = useState<Response>();
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        axios.get<Response>("https://ybotdiscord.tech/api/discord/guilds", { withCredentials: true }).then(res => {
            setGuilds(res.data);
            setLoading(false);
        }).catch(() => router.push("/api/discord/auth"));
    }, [router])

    while (loading) {
        return <Loading />
    }

    return (
        <div>
            <Head>
                <title>Dashboard • YBot</title>
                <meta property="og:title" content="YBot Dashboard" data-react-helmet="true" />
            </Head>
            {
                guilds?.mutualGuilds.map(g => (
                    <div key={g.id}>
                        <Center>
                            <Link href={`/dashboard/${g.id}/`}>
                                <Button>
                                    <Image 
                                        src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}?size=32`}
                                        borderRadius="full"
                                        fallbackSrc="plain.png"
                                        alt="Server Icon"
                                    />
                                    &nbsp;{g.name}
                                </Button>
                            </Link>
                        </Center>
                        <br/>
                    </div>
                ))
            }
            {
                guilds?.rest.map(g => ( 
                    <div key={g.id}>
                        <Center>
                            <Link href={`${baseURL}&guild_id=${g.id}`}>
                                <Button>
                                    <Image 
                                        src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}?size=32`}
                                        borderRadius="full"
                                        fallbackSrc="plain.png"
                                        alt="Server Icon"
                                    />
                                    &nbsp; Invite me to {g.name}!
                                </Button>
                            </Link>
                        </Center>

                        <br/>
                    </div>
                ))
            }
        </div>
    )
}

export default Dashboard;