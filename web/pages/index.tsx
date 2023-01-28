import { Anchor, Aside, Box, Button, Flex } from "@mantine/core";
import { trpc } from "../lib/client/trpc";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import CreateProject from "../components/projects/CreateProject";
import Link from "next/link";

export default function Index() {
  const { data, error, refetch } = trpc.project.list.useQuery();

  if (error) return <ErrorMessage />;
  if (!data) return <Loading />;

  return (
    <>
      {data.map((project) => (
        <Anchor
          component={Link}
          href={`/projects/${project._id}`}
          key={project._id}
        >
          {project.name}
        </Anchor>
      ))}
      <CreateProject onSuccess={() => refetch()} />
    </>
  );
}
