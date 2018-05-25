import Service, {inject as service} from '@ember/service';

export default Service.extend({
  store: service(),
  getFreshRepos(organization) {
    return organization.reload().then(organization => {
      return organization.get('repos').reload();
    });
  },
});
