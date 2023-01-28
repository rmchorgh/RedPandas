import { trpc } from "../lib/client/trpc";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import CreateProject from "../components/projects/CreateProject";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { UserButton } from "@clerk/nextjs";
import Banner from "../components/Banner";
import ProjectCont from "../components/projects/ProjectCont";

export default function Index() {
  const { data, error, refetch } = trpc.project.list.useQuery();
  // user switcher from clerk?

  if (error) return <ErrorMessage />;
  if (!data) return <Loading />;

  return (
    <>
      {/* <Banner /> */}
      <div className="top z-[2] h-[100vh] w-[100vw] bg-[#EAF2AB] p-10 text-[#808080e2]">
        {/* hello */}
        <div className="h-full w-full p-20  px-44">
          <div className="align-items flex h-full w-full flex-row flex-wrap items-center justify-center gap-10 ">
            <CreateProject onSuccess={() => refetch()} />
            {data.map((project) => (
              <ProjectCont
                key={project._id}
                href={`/projects/${project._id}`}
                name={project.name}
              />
            ))}
          </div>
        </div>
      </div>
    </>
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
