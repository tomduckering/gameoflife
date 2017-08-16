width = 500
height = 500
rule = 110
starting_rule = 0
max_rule = 255
$debug = false

def random_bool_array(length)
  length.times.map { Random.rand(2) % 2 == 0 }
end

def centred_single_point(length)
  array = length.times.map { false }
  array[length / 2 ] = true
  return array
end

def bool_array_to_string(array,true_char = 'X',false_char = '_')
  char_array = array.map do |element|
    element ? true_char : false_char 
  end
  char_array.join('')
end

def to_rule_index(left,element,right)
  ((left ? 1 : 0) * 4) + ((element ? 1 : 0) * 2) + ((right ? 1 : 0) * 1) 
end

def rule_decode(number)
  8.times.map {|i| number[i] == 1 }
end

def next_line(array,rule_data)
  array.each_with_index.map do |element,index|
    puts bool_array_to_string(array) if $debug
    print '-' * index if $debug
    puts '^' if $debug
    left = array[(index - 1) % array.length]
    right  = array[(index + 1) % array.length]
    rule_index = to_rule_index(left,element,right)
    puts "Rule Index: #{rule_index}" if $debug
    new_value = rule_data[rule_index]
    puts "New Value: #{new_value}" if $debug
    new_value
  end
end

def generate_lines(rule_data,width,height,initial_line)
  image_lines = []

  image_lines << initial_line
  prev_line = initial_line
  
  for i in 1..height
    new_line = next_line(prev_line,rule_data)
    puts "New Line:" if $debug
    puts bool_array_to_string(new_line) if $debug
    image_lines << new_line
    prev_line = new_line
  end
  return image_lines
end

def output_to_pgm(lines,width)
  black = '0'
  white = '1'
  string = ""
  string << "P2\n"
  height = lines.count
  string << "#{width} #{height}\n"
  string << "1\n"
  lines.each do |line|
    string << line.map {|value| value ? black : white }.join(' ')
    string << "\n"
  end
  return string
end

random_line = random_bool_array(width)

for rule in starting_rule..max_rule
  puts "Doing rule #{rule}"
  rule_data = rule_decode(rule)
  puts rule_data.join(",")
  initial_line = centred_single_point(width)
  initial_line = random_line
  line_data = generate_lines(rule_data,width,height,initial_line)
  pgm_string = output_to_pgm(line_data,width)
  file_name = "random_life_#{width}x#{height}_rule_#{rule}.pgm"
  File.write(file_name, pgm_string)
end

