import React from 'react'
import { requireAuth } from '@/lib/auth-utils';

const Page = async () => {
  await requireAuth();
  return (
    <div>Executions</div>
  )
}

export default Page