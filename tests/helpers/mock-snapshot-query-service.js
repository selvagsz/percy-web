import sinon from 'sinon';
import Service from '@ember/service';
import {resolve} from 'rsvp';

export default function mockSnapshotQueryFetches(context, snapshotsUnchanged, snapshotsChanged) {
  const snapshotQueryServiceStub = Service.extend({
    getUnchangedSnapshots: sinon.stub().returns(resolve(snapshotsUnchanged)),
    getChangedSnapshots: sinon.stub().returns(resolve(snapshotsChanged)),
  });
  context.register('service:snapshotQuery', snapshotQueryServiceStub);
  context.inject.service('snapshotQuery', {as: 'snapshotQueryService'});
  return snapshotQueryServiceStub;
}
