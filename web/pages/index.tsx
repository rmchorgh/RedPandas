import { trpc } from "../lib/client/trpc";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import CreateProject from "../components/projects/CreateProject";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

export default function Index() {
  const { data, error, refetch } = trpc.project.list.useQuery();

  if (error) return <ErrorMessage />;
  if (!data) return <Loading />;

  return (
    <p className="text-2xl">
      Hello <FontAwesomeIcon icon={faClock} />
    </p>
  );

  // return (
  //   <Box bg={colorScheme === "light" ? "gray.2" : "dark.9"} h="100%">
  //     <Container p="lg">
  //       <SimpleGrid cols={3}>
  //         <CreateProject onSuccess={() => refetch()} />
  //         {data.map((project) => (
  //           <Anchor
  //             component={Link}
  //             href={`/projects/${project._id}`}
  //             key={project._id}
  //           >
  //             <Paper shadow="xs" p="md" h={150}>
  //               <Text
  //                 c={{ light: "gray.9", dark: "white" }[colorScheme]}
  //                 fz="xl"
  //               >
  //                 {project.name}
  //               </Text>
  //             </Paper>
  //           </Anchor>
  //         ))}
  //       </SimpleGrid>
  //     </Container>
  //   </Box>
  // );
}
