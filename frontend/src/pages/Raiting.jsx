// import React, { useState, useEffect } from 'react';
// import { Table, Card, Tabs, Spin, message } from 'antd';
// import type { TabsProps } from 'antd';
// import axios from 'axios';
//
// interface SolutionRating {
//     solutionId: number;
//     solutionText: string;
//     status: string;
//     rating: number;
// }
//
// interface DeveloperRating {
//     developerId: number;
//     averageRating: number;
// }
//
// const RatingPage: React.FC = () => {
//     const [issueRatings, setIssueRatings] = useState<SolutionRating[]>([]);
//     const [developerRatings, setDeveloperRatings] = useState<DeveloperRating[]>([]);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [activeTab, setActiveTab] = useState<string>('1');
//
//     const fetchIssueRatings = async (issueId: number = 1, limit: number = 5) => {
//         try {
//             setLoading(true);
//             const response = await axios.get(`http://localhost:8090/api/top-rating/issue/${issueId}?limit=${limit}`);
//             setIssueRatings(response.data);
//         } catch (error) {
//             message.error('Failed to fetch issue ratings');
//             console.error('Error fetching issue ratings:', error);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const fetchDeveloperRatings = async (limit: number = 5) => {
//         try {
//             setLoading(true);
//             const response = await axios.get(`http://localhost:8090/api/top-rating/developers?limit=${limit}`);
//             setDeveloperRatings(response.data);
//         } catch (error) {
//             message.error('Failed to fetch developer ratings');
//             console.error('Error fetching developer ratings:', error);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     useEffect(() => {
//         if (activeTab === '1') {
//             fetchIssueRatings();
//         } else {
//             fetchDeveloperRatings();
//         }
//     }, [activeTab]);
//
//     const issueColumns = [
//         {
//             title: 'Solution ID',
//             dataIndex: 'solutionId',
//             key: 'solutionId',
//         },
//         {
//             title: 'Solution Text',
//             dataIndex: 'solutionText',
//             key: 'solutionText',
//             ellipsis: true,
//         },
//         {
//             title: 'Status',
//             dataIndex: 'status',
//             key: 'status',
//         },
//         {
//             title: 'Rating',
//             dataIndex: 'rating',
//             key: 'rating',
//             sorter: (a: SolutionRating, b: SolutionRating) => a.rating - b.rating,
//         },
//     ];
//
//     const developerColumns = [
//         {
//             title: 'Developer ID',
//             dataIndex: 'developerId',
//             key: 'developerId',
//         },
//         {
//             title: 'Average Rating',
//             dataIndex: 'averageRating',
//             key: 'averageRating',
//             sorter: (a: DeveloperRating, b: DeveloperRating) => a.averageRating - b.averageRating,
//         },
//     ];
//
//     const items: TabsProps['items'] = [
//         {
//             key: '1',
//             label: 'Top Solutions by Issue',
//             children: (
//                 <Table
//                     columns={issueColumns}
//                     dataSource={issueRatings}
//                     rowKey="solutionId"
//                     loading={loading}
//                     pagination={false}
//                 />
//             ),
//         },
//         {
//             key: '2',
//             label: 'Top Developers',
//             children: (
//                 <Table
//                     columns={developerColumns}
//                     dataSource={developerRatings}
//                     rowKey="developerId"
//                     loading={loading}
//                     pagination={false}
//                 />
//             ),
//         },
//     ];
//
//     return (
//         <div style={{ padding: '24px' }}>
//             <Card title="Rating Dashboard">
//                 <Tabs
//                     activeKey={activeTab}
//                     items={items}
//                     onChange={(key) => setActiveTab(key)}
//                 />
//             </Card>
//         </div>
//     );
// };
//
// export default RatingPage;