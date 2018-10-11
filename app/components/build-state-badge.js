import Component from '@ember/component';

export default Component.extend({
  build: null,
  classes: null,

  classNames: ['BuildStateBadge', 'float-right'],
  classNameBindings: [
    'classes',

    'build.isPending:BuildStateBadge--pending',
    'build.isProcessing:BuildStateBadge--processing',
    'build.isFinished:BuildStateBadge--finished',
    'build.isFailed:BuildStateBadge--failed',
    'build.isExpired:BuildStateBadge--expired',
    'build.isApproved:BuildStateBadge--approved',
    'build.hasDiffs:BuildStateBadge--hasDiffs',
  ],
});
