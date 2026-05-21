export interface InterviewAnswerItem {
  index: string;
  title: string;
  answer: string;
}

export interface InterviewAnswerDialogData {
  id: string;
  patient: string;
  medicalRecord: string;
  date: string;
  answers: InterviewAnswerItem[];
}
