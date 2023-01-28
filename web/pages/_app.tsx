import type { AppType } from "next/app";
import { trpc } from "../lib/client/trpc";
import Head from "next/head";
import { ClerkProvider, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Auth from "../components/Auth";
import { AppShell, Header, MantineProvider, Text, Group } from "@mantine/core";
//import { useColorScheme } from "@mantine/hooks";

const MyApp: AppType = ({ Component, pageProps }) => {
  //const colorScheme = useColorScheme();
  const colorScheme = "light";

  return (
    <>
      <Head>
        <title>RedPandas</title>
      </Head>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{ colorScheme }}
      >
        <ClerkProvider
          {...pageProps}
          appearance={{ baseTheme: { light: undefined, dark }[colorScheme] }}
        >
          <AppShell
            padding={0}
            header={
              <Header height={65}>
                <Group h="100%" px="lg" py="sm" position="apart">
                  <Text
                    fz={25}
                    c={{ light: "gray.9", dark: "white" }[colorScheme]}
                    fw={600}
                  >
                    RedPandas
                  </Text>
                  <Group>
                    <UserButton />
                  </Group>
                </Group>
              </Header>
            }
          >
            <Auth>
              <Component {...pageProps} />
            </Auth>
          </AppShell>
        </ClerkProvider>
      </MantineProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
