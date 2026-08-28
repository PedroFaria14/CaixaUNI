import PageTitle from '../components/PageTitle';
import { members } from '../data/mockData';

function Members() {
  return (
    <section className="content-stack page-enter">
      <PageTitle eyebrow="Governança" title="Membros e papéis" description="Uma pessoa pode consultar, criar solicitações ou aprovar, conforme seu papel." />
      <div className="member-grid">
        {members.map((member) => (
          <div className="panel member-card" key={member.id}>
            <div className="avatar">{member.name[0]}</div>
            <h3>{member.name}</h3>
            <span>{member.role}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Members;
