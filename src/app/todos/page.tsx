import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos, error } = await supabase.from('todos').select()

  if (error) {
    return <div>Error fetching todos: {error.message}</div>
  }

  return (
    <div style={{ padding: '100px', background: '#000', color: '#fff', minHeight: '100vh' }}>
      <h1>Supabase Todo Integration</h1>
      <ul>
        {todos?.map((todo: any) => (
          <li key={todo.id}>{todo.name}</li>
        ))}
      </ul>
      {(!todos || todos.length === 0) && <p>No todos found. Make sure to create a 'todos' table in Supabase.</p>}
    </div>
  )
}
