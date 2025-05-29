const categories = [
  'Home',
  'Job',
  'Car',
  'Location'
]
export type Category = (typeof categories)[number];
export default categories;

interface CategoryInput {
  name: string;
  options: string[];
}
export type CategoryInputType = {
  [key in Category]: CategoryInput;
};