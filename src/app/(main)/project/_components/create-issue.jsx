'use client';

import React, { useEffect } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { issueSchema } from '@/app/lib/validators';
import useFetch from '@/hooks/use-fetch';
import { createIssue } from '@/app/actions/issues';
import { getOrganizationUsers } from '@/app/actions/organization';
import { BarLoader } from 'react-spinners';
import { Input } from '@/components/ui/input';

const IssueCreationDrawer = ({
  isOpen,
  onClose,
  sprintId,
  status,
  projectId,
  onIssueCreated,
  orgId,
}) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      priority: "MEDIUM",
      description: "",
      assigneeId: ""
    }
  });

  const {
    loading: createIssueLoading,
    fn: createIssueFn,
    error,
    data: newIssue,
  } = useFetch(createIssue);

  const {
    loading: usersLoading,
    fn: fetchUsers,
    data: users,
  } = useFetch(getOrganizationUsers);

  useEffect(() => {
    if (isOpen && orgId) {
      fetchUsers(orgId)
    }
  }, [isOpen, orgId]);

  const onSubmit = async (data) => {

  };

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Issue</DrawerTitle>
        </DrawerHeader>
        {usersLoading && <BarLoader width={"100%"} color='#36d7b7' />}
        <form className="p-4 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <Input
              id="title"
              {...register("title")}
            />
            {errors.title && (<p className="text-red-500 text-sm mt-1">{errors.title.message}</p>)}
          </div>
          <div>
            <label htmlFor="assigneeId" className="block text-sm font-medium mb-1">
              Assignee
            </label>
            <Controller name='assigneeId' control={control} render={(field) => {
              <Select onValueChanged={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Assignee" />
                </SelectTrigger>
                <SelectContent>
                  {users?.map((user) => {
                    <SelectItem key={user.id} value={user.id}>{user?.name}</SelectItem>
                  })};
                </SelectContent>
              </Select>
            }} />
            {errors.title && (<p className="text-red-500 text-sm mt-1">{errors.title.message}</p>)}
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  )
}

export default IssueCreationDrawer;