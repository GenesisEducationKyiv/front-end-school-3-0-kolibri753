export interface TrackData {
  id: string;
  slug: string;
  title: string;
  artist: string;
  album?: string;
  genres: string[];
  coverImage?: string;
  createdAt: string;
  audioFile?: string;
}

export const mockTracks: TrackData[] = [
  {
    id: "1",
    slug: "1",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    genres: ["Rock", "Opera"],
    album: "A Night at the Opera",
    createdAt: "2025-03-04T13:13:12.828Z",
    audioFile: "123.mp3",
  },
  {
    id: "2",
    slug: "2",
    title: "Hotel California",
    artist: "Eagles",
    genres: ["Rock"],
    album: "Hotel California",
    createdAt: "2025-03-04T13:13:12.828Z",
    audioFile: "123.mp3",
  },
  {
    id: "3",
    slug: "3",
    title: "Imagine",
    artist: "John Lennon",
    genres: ["Rock", "Pop"],
    album: "Imagine",
    createdAt: "2025-03-04T13:13:12.828Z",
    audioFile: "123.mp3",
  },
  {
    id: "4",
    slug: "4",
    title: "Billie Jean",
    artist: "Michael Jackson",
    genres: ["Pop", "Funk"],
    album: "Thriller",
    createdAt: "2025-03-04T13:13:12.828Z",
    audioFile: "123.mp3",
  },
  {
    id: "5",
    slug: "5",
    title: "Like a Rolling Stone",
    artist: "Bob Dylan",
    genres: ["Folk", "Rock"],
    album: "Highway 61 Revisited",
    createdAt: "2025-03-04T13:13:12.828Z",
    audioFile: "123.mp3",
  },
];

export const newTrackData = {
  title: "Test Track",
  artist: "Test Artist",
  genres: ["Rock"],
  album: "Test Album",
};

export const updatedTrackData = {
  title: "Updated Test Track",
  artist: "Updated Test Artist",
  genres: ["Pop", "Rock"],
  album: "Updated Test Album",
};

export const mockApiResponses = {
  tracks: {
    success: {
      data: mockTracks,
      meta: {
        totalPages: 2,
        currentPage: 1,
        totalCount: 5,
        limit: 10,
      },
    },
    empty: {
      data: [],
      meta: {
        totalPages: 0,
        currentPage: 1,
        totalCount: 0,
        limit: 10,
      },
    },
    error: {
      error: "Internal server error",
      message: "Failed to fetch tracks",
    },
  },
  artists: {
    success: ["Queen", "Eagles", "John Lennon", "Michael Jackson", "Bob Dylan"],
  },
  genres: {
    success: ["Rock", "Pop", "Opera", "Funk", "Folk"],
  },
  createTrack: {
    success: {
      id: "6",
      title: "Test Track",
      artist: "Test Artist",
      genres: ["Rock"],
      album: "Test Album",
      hasFile: false,
    },
    error: {
      error: "Validation failed",
      message: "Title is required",
    },
  },
  updateTrack: {
    success: {
      id: "1",
      title: "Updated Test Track",
      artist: "Updated Test Artist",
      genres: ["Pop", "Rock"],
      album: "Updated Test Album",
      hasFile: true,
    },
  },
  deleteTrack: {
    success: { message: "Track deleted successfully" },
  },
  uploadFile: {
    success: { message: "File uploaded successfully" },
    error: {
      error: "Upload failed",
      message: "Invalid file format",
    },
  },
  bulkDelete: {
    success: {
      success: ["1", "2"],
      failed: [],
    },
    partialFailure: {
      success: ["1"],
      failed: ["2"],
    },
  },
};
