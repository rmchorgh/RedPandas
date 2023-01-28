import { useRouter } from "next/router";
import { Aside, Box, Flex } from "@mantine/core";
import { trpc } from "../../lib/client/trpc";
import Dataset from "../../components/project/Dataset";
import Commands from "../../components/project/Commands";

export default function Project() {
  const router = useRouter();

  return (
    <Flex h="100%">
      <Box sx={{ flex: 1 }}>
        <Dataset projectId={router.query.project as string} />
      </Box>
      <Aside w={500} pos="static">
        <Commands projectId={router.query.project as string} />
      </Aside>
    </Flex>
  );
}
