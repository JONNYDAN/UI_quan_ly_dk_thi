import UpcomingExamsView from '../sections/upcoming-exams/view/upcoming-exams-view';

export type { Exam } from '../sections/upcoming-exams/view/upcoming-exams-view';

export default function UpcomingExamsPage() {
  const ongoingExams = {
    title: 'Kỳ thi TOEIC',
    code: 'TOEIC2024',
    fee: '1.500.000',
    date: '15/12/2024',
    time: '08:00 - 11:00',
    place: 'Hội đồng thi A - 123 Nguyễn Văn Linh',
    registered: 150,
    capacity: 200,
    deadline: '10/12/2024',
    description: 'Kỳ thi đánh giá năng lực tiếng Anh giao tiếp quốc tế',
    requirement: 'CMND/CCCD bản gốc, ảnh 3x4',
    isOpen: true,
    batch: '1',
    school: 'Trường THCS Quang Trung',
    dateRange: {
      start: '15/12/2024',
      end: '16/12/2024',
    },
    examSession: 'Sáng',
    examDate: '15/12/2024',
    examTime: '07:30',
    subject: 'TOEIC Listening & Reading',
    notice: 'Vui lòng mang CMND/CCCD bản gốc và đến trước giờ thi 30 phút',
  };

  const upcomingExams = {
    title: 'Kỳ thi TOEIC',
    code: 'TOEIC2024',
    fee: '1.500.000',
    date: '16/12/2024',
    time: '13:00 - 16:00',
    place: 'Hội đồng thi B - 124 Nguyễn Văn Cừ',
    registered: 0,
    capacity: 200,
    deadline: '11/12/2024',
    description: 'Kỳ thi đánh giá năng lực tiếng Anh giao tiếp quốc tế',
    requirement: 'CMND/CCCD bản gốc, ảnh 3x4',
    isOpen: false,
    batch: '1',
    school: 'Trường THCS Quang Trung',
    dateRange: {
      start: '16/12/2024',
      end: '17/12/2024',
    },
    examSession: 'Sáng',
    examDate: '16/12/2024',
    examTime: '13:30',
    subject: 'TOEIC Listening & Reading',
    notice: 'Vui lòng mang CMND/CCCD bản gốc và đến trước giờ thi 30 phút',
  };

  return (
    <>
      <title>Các kỳ thi sắp diễn ra</title>
      <UpcomingExamsView ongoingExams={ongoingExams} upcomingExams={upcomingExams} />
    </>
  );
}
