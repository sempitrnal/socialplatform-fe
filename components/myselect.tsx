export interface SelectProps {
	changeHandler: (e: React.FormEvent<HTMLSelectElement>) => void;
	label: string;
	name: string;
	min?: string;
	options: any[];
	value?: string;
}

const Select = ({
	changeHandler,
	label,
	name,
	min,
	options,
	value,
}: SelectProps) => {
	return (
		<div className="relative">
			<select
				required
				id={name}
				name={name}
				onChange={changeHandler}
				className={`rounded-md py-2 px-4 w-full  outline-none 
         bg-[#fff]  focus:bg-white  
         border  border-[#292929] transition-all duration-300 shadow-sm 
          `}
			>
				{options.map((e: any, i: any) => {
					return (
						<option key={i} value={e.value}>
							{e.name}
						</option>
					);
				})}
			</select>

			<label
				htmlFor={name}
				className="absolute pointer-events-none left-[10px] top-[-10px] text-gray-400  text-sm rounded-md bg-white px-[10px]"
			>
				{label}
			</label>
		</div>
	);
};

export default Select;
