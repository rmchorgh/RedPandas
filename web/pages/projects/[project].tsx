import { useRouter } from "next/router";
import {
  Anchor,
  Aside,
  Box,
  Breadcrumbs,
  Flex,
  Stack,
  Text,
} from "@mantine/core";
import { trpc } from "../../lib/client/trpc";
import Dataset from "../../components/project/Dataset";
import Commands from "../../components/project/Commands";
import Link from "next/link";

export default function Project() {
  const router = useRouter();

  return (
    <Flex direction="column" h="100%">
      <Breadcrumbs p="lg" sx={{ borderBottom: "1px solid #e9ecef" }}>
        <Anchor component={Link} href="/">
          Projects
        </Anchor>
        <Text>ssss</Text>
      </Breadcrumbs>
      <Flex sx={{ flex: 1 }}>
        <Box sx={{ flex: 1 }}>
          <Dataset projectId={router.query.project as string} />
        </Box>
        <Aside w={500} pos="static">
          <Commands projectId={router.query.project as string} />
        </Aside>
      </Flex>
    </Flex>
  );
}
