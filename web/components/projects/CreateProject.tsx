// import {
//   Button,
//   Flex,
//   Modal,
//   Paper,
//   Stack,
//   Text,
//   TextInput,
// } from "@mantine/core";
// import {
//   Modal
// } from 
import { trpc } from "../../lib/client/trpc";
import ErrorMessage from "../ErrorMessage";
import { createProjectSchema } from "../../lib/schemas";
// import { useForm, zodResolver } from "@mantine/form";
// import { IconPlus } from "@tabler/icons-react";
// import { useColorScheme } from "@mantine/hooks";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Modal from 'react-modal';
import React from 'react';
import ReactDOM from 'react-dom';


export interface CreateProjectProps {
  onSuccess?: () => void;
} 

export default function CreateProject({ onSuccess }: CreateProjectProps) {
  // const colorScheme = useColorScheme();
  const { mutate, error } = trpc.project.create.useMutation({ onSuccess });
  const [opened, setOpened] = useState(false);

  // const form = useForm({
  //   initialValues: {
  //     name: "",
  //     datasetId: "",
  //     revisionId: "",
  //   },
  //   validate: zodResolver(createProjectSchema),
  // });

  return (
    <>
    <div className="card-hovered z-[3] flex h-[250px] w-[250px] 
    flex-col items-center hover:text-[#FD7F2C] justify-center 
    rounded-lg border bg-white hover:border-[#FD7F2C]"
    onClick={() => setOpened(true)}
    >
      <FontAwesomeIcon icon={faPlus} size={"4x"} />
      <div className=" text-xl font-semibold mt-10 font-sans hover:text-[#FD7F2C]">New Project</div>
    </div>

      <Modal
        contentLabel="New Project"
        isOpen={opened}
        onRequestClose={() => setOpened(false)}
        className="bg-black w-full h-full z-[100]"
      >
        {/* {error && <ErrorMessage />}
        <form onSubmit={form.onSubmit((values) => mutate(values))} noValidate>
          <TextInput label="Name" {...form.getInputProps("name")} mb="md" />
          <TextInput
            label="Dataset ID"
            {...form.getInputProps("datasetId")}
            mb="md"
          />
          <TextInput
            label="Revision ID"
            {...form.getInputProps("revisionId")}
            mb="md"
          />
          <Button type="submit">Create Project</Button>
        </form> */}
      </Modal>
      </>
  );
}
