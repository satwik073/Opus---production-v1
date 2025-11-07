'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAtomValue } from "jotai"
import { editorAtom } from "@/features/editor/store/atoms"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect } from "react"

const formSchema = z.object({
    endpoint: z.string().url({ message: 'Please enter a valid URL' }),
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'], { message: 'Please select a valid method' }),
    body: z.string().optional()
    // .refine(),
})

export type HttpRequestFormValues = z.infer<typeof formSchema>
interface HttpRequestDialogueProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    defaultValues?: Partial<HttpRequestFormValues>;
}
export const HttpRequestDialogue = ({ open, onOpenChange, onSubmit, defaultValues = {} }: HttpRequestDialogueProps) => {
    const editor = useAtomValue(editorAtom);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            endpoint: defaultValues.endpoint || '',
            method: defaultValues.method || 'GET',
            body: defaultValues.body || undefined
        }
    })
    useEffect(() => {
        if (open) {
            form.reset({
                endpoint: defaultValues.endpoint || '',
                method: defaultValues.method || 'GET',
                body: defaultValues.body || undefined
            })
        }
    }, [open, defaultValues, form])
    const watchMethod = form.watch('method');
    const showBody = ['POST', 'PUT', 'PATCH'].includes(watchMethod);

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values);
        onOpenChange(false);
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>HTTP Request</DialogTitle>
                    <DialogDescription>
                        Configure settings for the HTTP request node.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 mt-4">
                        <FormField control={form.control} name="method" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Method</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a method" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="GET">GET</SelectItem>
                                        <SelectItem value="POST">POST</SelectItem>
                                        <SelectItem value="PUT">PUT</SelectItem>
                                        <SelectItem value="DELETE">DELETE</SelectItem>
                                        <SelectItem value="PATCH">PATCH</SelectItem>
                                        <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                                        <SelectItem value="HEAD">HEAD</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>Select the HTTP method to use for the request.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="endpoint" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Endpoint</FormLabel>
                                <FormControl><Input placeholder="https://example.com/api/v1/{{httpsRequest.data.id}}" {...field} /></FormControl>
                                <FormDescription>Static URL or dynamic URL using {"{{variables}}"} for simple values or {"{{json variable}}"} to stringify objects.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                        {
                            showBody && (
                                <FormField control={form.control} name="body" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Body</FormLabel>
                                        <FormControl><Textarea placeholder={
                                            '{\n "userId": "{{httpsRequest.data.userId}}"}, \n "productId": "{{httpsRequest.data.productId}}"\n}'
                                        } {...field} /></FormControl>
                                        <FormDescription>Enter the body of the request. Use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringify objects.</FormDescription>
                                    </FormItem>
                                )} />
                            )
                        }
                        <DialogFooter className="mt-4">
                            <Button type="button" variant="outline" className="cursor-pointer" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button type="submit" className="cursor-pointer">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}