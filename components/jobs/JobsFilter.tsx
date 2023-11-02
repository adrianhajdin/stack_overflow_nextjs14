"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LocalSearchbar from "../shared/search/LocalSearchbar";

import { Country } from "@/types";
import { formUrlQuery } from "@/lib/utils";

interface JobsFilterProps {
  countriesList: Country[];
}

const JobsFilter = ({ countriesList }: JobsFilterProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleUpdateParams = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "location",
      value,
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className='relative mt-11 flex w-full justify-between gap-5 max-sm:flex-col sm:items-center'>
      <LocalSearchbar
        route={pathname}
        iconPosition='left'
        imgSrc='/assets/icons/job-search.svg'
        placeholder='Job Title, Company, or Keywords'
        otherClasses='flex-1 max-sm:w-full'
      />

      <Select onValueChange={(value) => handleUpdateParams(value)}>
        <SelectTrigger className='body-regular light-border background-light800_dark300 text-dark500_light700 line-clamp-1 flex min-h-[56px] items-center gap-3 border p-4 sm:max-w-[210px]'>
          <Image
            src='/assets/icons/carbon-location.svg'
            alt='location'
            width={18}
            height={18}
          />
          <div className='line-clamp-1 flex-1 text-left'>
            <SelectValue placeholder='Select Location' />
          </div>
        </SelectTrigger>

        <SelectContent className='body-semibold max-h-[350px] max-w-[250px]'>
          <SelectGroup>
            {countriesList ? (
              countriesList.map((country: Country) => (
                <SelectItem
                  key={country.name.common}
                  value={country.name.common}
                  className='px-4 py-3'
                >
                  {country.name.common}
                </SelectItem>
              ))
            ) : (
              <SelectItem value='No results found'>No results found</SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default JobsFilter;
