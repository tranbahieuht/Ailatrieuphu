export type AnswerIndex = 0 | 1 | 2 | 3;
export type Question = {
  id: number;
  topic: string;
  question: string;
  answers: readonly [string, string, string, string];
  correct: AnswerIndex;
  explanation: string;
  hint: string;
  source: 'textbook' | 'marx';
};

export const sources = {
  textbook: {
    title: 'Bộ GD&ĐT · Giáo trình Triết học Mác – Lênin',
    detail: 'Chương X: Hình thái kinh tế – xã hội, các mục I–IV. Bản giáo trình lưu tại thư viện Trường Cao đẳng Sư phạm Lạng Sơn.',
    url: 'https://tailieuso.lce.vn/wp-content/uploads/2023/06/Giao-trinh-Triet-hoc-Mac-Leninf4426fe_triethocmaclenin.pdf',
  },
  marx: {
    title: 'C. Mác · Lời tựa Góp phần phê phán khoa kinh tế chính trị (1859)',
    detail: 'Đối chiếu các luận điểm về quan hệ sản xuất, cơ sở kinh tế và sự chuyển biến xã hội. Câu hỏi được biên soạn bằng tiếng Việt.',
    url: 'https://www.marxists.org/archive/marx/works/1859/critique-pol-economy/preface.htm',
  },
};

// Bộ câu hỏi mới, biên soạn theo sự cho phép của người dùng ngày 16/11/2026.
// Không phải bản sao của bộ câu hỏi gốc (chưa được cung cấp).
export const questions: readonly Question[] = [
  {
    id: 1, topic: 'Nền tảng của đời sống xã hội',
    question: 'Theo chủ nghĩa duy vật lịch sử, hoạt động nào là cơ sở của sự tồn tại và phát triển xã hội?',
    answers: ['Sáng tạo nghệ thuật', 'Sản xuất vật chất', 'Hoạt động tôn giáo', 'Nghiên cứu triết học'],
    correct: 1, explanation: 'Sản xuất vật chất cung cấp điều kiện sinh hoạt thiết yếu, tạo nền tảng cho các hoạt động xã hội khác.',
    hint: 'Hãy nghĩ đến hoạt động tạo ra lương thực, quần áo và nhà ở.', source: 'textbook',
  },
  {
    id: 2, topic: 'Phương thức sản xuất',
    question: 'Hai mặt hợp thành một phương thức sản xuất là gì?',
    answers: ['Cơ sở hạ tầng và nhà nước', 'Khoa học và tôn giáo', 'Lực lượng sản xuất và quan hệ sản xuất', 'Đạo đức và pháp luật'],
    correct: 2, explanation: 'Phương thức sản xuất thống nhất năng lực sản xuất với những quan hệ xã hội trong sản xuất.',
    hint: 'Một mặt thể hiện năng lực thực tiễn; mặt kia thể hiện quan hệ giữa người với người.', source: 'marx',
  },
  {
    id: 3, topic: 'Lực lượng sản xuất',
    question: 'Lực lượng sản xuất là sự kết hợp giữa những yếu tố nào?',
    answers: ['Người lao động và tư liệu sản xuất', 'Nhà nước và các đảng phái', 'Đạo đức và phong tục', 'Sở hữu và phân phối'],
    correct: 0, explanation: 'Người lao động sử dụng tư liệu sản xuất để tác động vào tự nhiên, tạo ra của cải vật chất.',
    hint: 'Hãy tìm sự kết hợp trực tiếp tạo nên năng lực sản xuất thực tế.', source: 'textbook',
  },
  {
    id: 4, topic: 'Quan hệ sản xuất',
    question: 'Quan hệ sản xuất trước hết là quan hệ giữa những chủ thể nào?',
    answers: ['Con người với tự nhiên', 'Các sự vật tự nhiên', 'Con người với thế giới siêu nhiên', 'Người với người trong sản xuất'],
    correct: 3, explanation: 'Quan hệ sản xuất là quan hệ xã hội giữa người với người hình thành trong quá trình sản xuất.',
    hint: 'Phân biệt mặt xã hội của sản xuất với sự tác động kỹ thuật vào tự nhiên.', source: 'marx',
  },
  {
    id: 5, topic: 'Mốc an toàn thứ nhất',
    question: 'Ba mặt cơ bản của quan hệ sản xuất bao gồm những gì?',
    answers: ['Chính trị, đạo đức và tôn giáo', 'Sở hữu, tổ chức quản lý và phân phối', 'Công cụ, nguyên liệu và máy móc', 'Khoa học, kỹ thuật và công nghệ'],
    correct: 1, explanation: 'Quan hệ sản xuất gồm sở hữu tư liệu sản xuất, tổ chức quản lý sản xuất và phân phối sản phẩm.',
    hint: 'Ai sở hữu, ai tổ chức và kết quả sản xuất được chia thế nào?', source: 'textbook',
  },
  {
    id: 6, topic: 'Quy luật của sản xuất',
    question: 'Trong mối quan hệ giữa lực lượng sản xuất và quan hệ sản xuất, yếu tố nào giữ vai trò quyết định?',
    answers: ['Quan hệ sản xuất', 'Ý muốn của nhà quản lý', 'Lực lượng sản xuất', 'Tập quán tiêu dùng'],
    correct: 2, explanation: 'Sự phát triển của lực lượng sản xuất đặt ra yêu cầu thay đổi quan hệ sản xuất cho phù hợp.',
    hint: 'Hãy xét điều gì tạo ra yêu cầu khách quan phải cải biến các quan hệ kinh tế.', source: 'marx',
  },
  {
    id: 7, topic: 'Sự tác động trở lại',
    question: 'Quan hệ sản xuất phù hợp với trình độ lực lượng sản xuất sẽ có tác động chủ yếu nào?',
    answers: ['Thúc đẩy lực lượng sản xuất phát triển', 'Làm lực lượng sản xuất ngừng biến đổi', 'Xóa bỏ nhu cầu lao động', 'Thay thế hoàn toàn công cụ lao động'],
    correct: 0, explanation: 'Sự phù hợp tạo điều kiện phát huy năng lực sản xuất; quan hệ lỗi thời có thể trở thành lực cản.',
    hint: 'Một hình thức tổ chức phù hợp giúp năng lực sản xuất được phát huy.', source: 'marx',
  },
  {
    id: 8, topic: 'Cơ sở hạ tầng',
    question: 'Trong triết học Mác – Lênin, cơ sở hạ tầng của xã hội được hiểu là gì?',
    answers: ['Hệ thống đường sá và cầu cống', 'Tổng số máy móc của xã hội', 'Toàn bộ quan điểm chính trị', 'Toàn bộ quan hệ sản xuất hợp thành cơ cấu kinh tế'],
    correct: 3, explanation: 'Ở đây, cơ sở hạ tầng chỉ cơ cấu các quan hệ sản xuất, không chỉ các công trình kỹ thuật.',
    hint: 'Đây là phạm trù về cơ cấu kinh tế, không phải khái niệm xây dựng.', source: 'marx',
  },
  {
    id: 9, topic: 'Kiến trúc thượng tầng',
    question: 'Yếu tố nào sau đây thuộc kiến trúc thượng tầng của xã hội?',
    answers: ['Nguyên liệu sản xuất', 'Quan điểm pháp quyền và nhà nước', 'Máy công cụ', 'Quan hệ sở hữu tư liệu sản xuất'],
    correct: 1, explanation: 'Kiến trúc thượng tầng bao gồm các quan điểm xã hội cùng những thiết chế tương ứng, như nhà nước.',
    hint: 'Tìm yếu tố thuộc hệ thống tư tưởng và thiết chế xã hội.', source: 'textbook',
  },
  {
    id: 10, topic: 'Mốc an toàn thứ hai',
    question: 'Theo chủ nghĩa duy vật lịch sử, cơ sở hạ tầng có vai trò gì đối với kiến trúc thượng tầng?',
    answers: ['Không có liên hệ', 'Chỉ quyết định tên gọi', 'Giữ vai trò quyết định', 'Hoàn toàn phụ thuộc một chiều'],
    correct: 2, explanation: 'Cơ cấu kinh tế là nền tảng hình thành kiến trúc thượng tầng và chi phối sự biến đổi của nó.',
    hint: 'Hãy xem xét nền tảng kinh tế của các quan hệ pháp luật và chính trị.', source: 'marx',
  },
  {
    id: 11, topic: 'Quan hệ biện chứng',
    question: 'Nhận định nào đúng về sự tác động của kiến trúc thượng tầng đối với cơ sở hạ tầng?',
    answers: ['Có tính độc lập tương đối và tác động trở lại', 'Hoàn toàn thụ động, không có tác động', 'Luôn quyết định cơ sở hạ tầng', 'Luôn làm kinh tế phát triển nhanh hơn'],
    correct: 0, explanation: 'Kiến trúc thượng tầng có thể thúc đẩy hoặc kìm hãm kinh tế, tùy mức độ phù hợp với yêu cầu khách quan.',
    hint: 'Quan hệ biện chứng bao hàm cả vai trò quyết định và sự tác động trở lại.', source: 'textbook',
  },
  {
    id: 12, topic: 'Cấu trúc hình thái xã hội',
    question: 'Những mặt cơ bản cấu thành một hình thái kinh tế – xã hội là gì?',
    answers: ['Dân số, lãnh thổ và khí hậu', 'Tôn giáo, nghệ thuật và đạo đức', 'Quốc hội, chính phủ và tòa án', 'Lực lượng sản xuất, quan hệ sản xuất và kiến trúc thượng tầng'],
    correct: 3, explanation: 'Hình thái kinh tế – xã hội là chỉnh thể thống nhất giữa lực lượng sản xuất, quan hệ sản xuất và kiến trúc thượng tầng.',
    hint: 'Kết hợp năng lực sản xuất, cơ cấu quan hệ kinh tế và hệ thống tư tưởng, thiết chế tương ứng.', source: 'textbook',
  },
  {
    id: 13, topic: 'Động lực chuyển biến xã hội',
    question: 'Khi quan hệ sản xuất trở thành lực cản đối với lực lượng sản xuất, yêu cầu khách quan đặt ra là gì?',
    answers: ['Ngừng phát triển lực lượng sản xuất', 'Cải biến quan hệ sản xuất cho phù hợp', 'Giữ nguyên mọi quan hệ kinh tế', 'Chỉ thay đổi tên các cơ sở sản xuất'],
    correct: 1, explanation: 'Mâu thuẫn đòi hỏi cải biến quan hệ sản xuất, mở đường cho năng lực sản xuất phát triển.',
    hint: 'Giải quyết mâu thuẫn bằng cách tháo gỡ hình thức kinh tế đang cản trở sự phát triển.', source: 'marx',
  },
  {
    id: 14, topic: 'Quá trình lịch sử – tự nhiên',
    question: 'Vì sao sự phát triển các hình thái kinh tế – xã hội được coi là một quá trình lịch sử – tự nhiên?',
    answers: ['Vì không có hoạt động của con người', 'Vì chỉ phụ thuộc điều kiện khí hậu', 'Vì tuân theo quy luật khách quan của xã hội', 'Vì mọi dân tộc có lịch sử giống hệt nhau'],
    correct: 2, explanation: 'Quá trình ấy diễn ra theo quy luật khách quan thông qua hoạt động thực tiễn của con người.',
    hint: 'Tính khách quan không phủ nhận vai trò hoạt động của con người.', source: 'textbook',
  },
  {
    id: 15, topic: 'Chinh phục đỉnh cao',
    question: 'Quan điểm lịch sử – tự nhiên có đòi hỏi mọi dân tộc đều trải qua tuần tự tất cả các hình thái kinh tế – xã hội không?',
    answers: ['Không; có thể bỏ qua một hoặc vài hình thái trong điều kiện nhất định', 'Có; mọi dân tộc phải đi theo lộ trình giống hệt nhau', 'Không; có thể bỏ qua mọi điều kiện vật chất', 'Có; và thời gian phát triển phải bằng nhau'],
    correct: 0, explanation: 'Lịch sử có tính đa dạng: trong điều kiện nhất định, một dân tộc có thể bỏ qua một hoặc vài hình thái.',
    hint: 'Phân biệt quy luật chung của lịch sử với con đường cụ thể của từng dân tộc.', source: 'textbook',
  },
];
