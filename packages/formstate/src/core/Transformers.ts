export class Transformers {
	static trim = (value: string) => value?.trim();

	static toUpperCase = (value: string) => value?.toUpperCase();

	static toLowerCase = (value: string) => value?.toLowerCase();

	static toNumber = (value: string | number) => {
		if (typeof value === 'number') return value;
		const num = parseFloat(value);
		return isNaN(num) ? value : num;
	};

	static compose(...transformers: Array<(value: unknown) => unknown>) {
		return (value: unknown) => {
			return transformers.reduce((acc, transformer) => transformer(acc), value);
		};
	}
}
