export interface Comment {
  $id: string;
  content: string;
  $createdAt: string;
  status: 'pending' | 'rejected' | 'approved';
  user?: {
    $id: string;
    name: string;
    imageUrl?: string;
  };
  guestName: string;
  guestEmail: string;
  blog: {
    $id: string;
    title: string;
  };
}

export interface AddCommentType {
  blogId: string;
  content: string;
  guestUser?: {
    name: string;
    email?: string;
  };
} 