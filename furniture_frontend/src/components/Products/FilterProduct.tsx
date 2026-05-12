import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "../ui/checkbox";
import type { Category } from "../../types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";

interface filterProps {
  categories: Category[];
  types: Category[];
}

interface ProductFilterProps {
  filterList: filterProps;
  selectedCategory: string[];
  selectedType: string[];
  handleFilterChange: (category: string[], type: string[]) => void;
}
const FormSchema = z.object({
  categories: z.array(z.string()),
  types: z.array(z.string()),
});

export default function FilterProduct({
  filterList,
  selectedCategory,
  selectedType,
  handleFilterChange,
}: ProductFilterProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      categories: selectedCategory,
      types: selectedType,
    },
  });
  
  //remains the same with filter list
  useEffect(() => {
    form.reset({
      categories: selectedCategory,
      types: selectedType,
    });
  }, [form, selectedCategory, selectedType]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    handleFilterChange(data.categories, data.types);
  }
  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="categories"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Furniture Made By</FormLabel>
                </div>
                {filterList.categories.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="categories"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-center gap-2"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(
                                item.id.toString(),
                              )}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...field.value,
                                      item.id.toString(),
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id.toString(),
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {item.name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="types"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Furniture Types</FormLabel>
                </div>
                {filterList.types.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="types"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-center gap-2"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(
                                item.id.toString(),
                              )}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...field.value,
                                      item.id.toString(),
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id.toString(),
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {item.name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant={"outline"}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
