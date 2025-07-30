import React from 'react';
import { format } from 'date-fns';

const GeneralMemberContributionsList = ({ contributions, members, onViewSpecificMemberContributions }) => {

    const getMemberName = (memberId) => {
        const member = members.find(m => String(m.memberId) === String(memberId));
        return member ? `${member.firstName} ${member.lastName}` : 'Unknown Member';
    };

    const uniqueContributors = Array.from(
        new Set(contributions.map(c => c.memberId))
    ).map(memberId => {
        const member = members.find(m => String(m.memberId) === String(memberId));
        return {
            memberId: memberId,
            fullName: member ? `${member.firstName} ${member.lastName}` : 'Unknown Member',
            totalContributions: contributions
                .filter(c => String(c.memberId) === String(memberId))
                .reduce((sum, c) => sum + Number(c.amount), 0),
        };
    }).sort((a, b) => a.fullName.localeCompare(b.fullName));


    return (
        <div className="contribution-list">
            {contributions.length === 0 ? (
                <div className="warning">
                    No contributions recorded yet.
                </div>
            ) : (
                <>
                    <h3 className="sub-title">Summary by Contributor</h3>
                    <div className="table-responsive" style={{ marginBottom: '2rem' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th className="text-light">Contributor Name</th>
                                    <th className="text-light">Total Contributed</th>
                                    <th className="text-light">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {uniqueContributors.map(contributor => (
                                    <tr key={contributor.memberId}>
                                        <td>{contributor.fullName}</td>
                                        <td>{contributor.totalContributions.toFixed(2)}</td>
                                        <td>
                                            <button
                                                onClick={() => onViewSpecificMemberContributions(contributor.memberId)}
                                                className="view-btn"
                                            >
                                                View All Contributions
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <h3 className="sub-title">Detailed Contribution List</h3>
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th className="text-light">Contributor Name</th>
                                    <th className="text-light">Date</th>
                                    <th className="text-light">Amount</th>
                                    <th className="text-light">Contribution Type</th>
                                    <th className="text-light">Mode of Payment</th>
                                    <th className="text-light">Comments</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contributions
                                    .sort((a, b) => new Date(b.dateOfContribution) - new Date(a.dateOfContribution))
                                    .map((contribution) => (
                                        <tr key={contribution.contributionId}>
                                            <td>{getMemberName(contribution.memberId)}</td>
                                            <td>{format(new Date(contribution.dateOfContribution), 'PPP')}</td>
                                            <td>{Number(contribution.amount).toFixed(2)}</td>
                                            <td>{contribution.contributionType || 'N/A'}</td>
                                            <td>{contribution.modeOfPayment}</td>
                                            <td>{contribution.comments}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default GeneralMemberContributionsList;