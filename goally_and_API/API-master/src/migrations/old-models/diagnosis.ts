// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as mongoose from 'mongoose';
import { connect } from './olconnection';

const Schema = mongoose.Schema;

const Diagnosis = new Schema({
  parentId: { type: String },
  childId: { type: String },
  diagnosis: { type: [String], optional: true, defaultValue: null },
});

const OldDiagnosis = connect.model('Diagnosis', Diagnosis, 'diagnosis');

export { OldDiagnosis };
