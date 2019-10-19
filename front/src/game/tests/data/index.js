import readYaml, {initialPatternLines} from './parser';

const d = readYaml(`${__dirname}/default.yaml`);
export default d;

export {initialPatternLines};
