/* CLI owns filesystem access; the Csound Teatro relationship/validation
 * module stays pure so the very same authoring projection can be inspected
 * in a browser without introducing a second grammar.
 */
import {readFileSync} from 'node:fs';
import {validateScenario,projectRelations} from './validate-scenario.mjs';
const path=process.argv[2];
if(!path)throw new Error('Usage: node check-scenario.mjs scenarios/csound-teatro/composing-by-ear.live.json');
const scenario=JSON.parse(readFileSync(path,'utf8'));
const checked=validateScenario(scenario);
console.log('CSOUND_TEATRO_GRAMMAR_0_1_CANDIDATE_CHECKED',JSON.stringify(checked,null,2));
console.log('\n--- GRAMMAR 0.1 PROJECTION (NOT EXECUTION) ---\n'+
  projectRelations(scenario));
