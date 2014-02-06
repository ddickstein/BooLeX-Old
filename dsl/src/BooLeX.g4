grammar BooLeX;

// Top level declaration for a BooLeX file.
module
    : circuitDeclaration* EOF
    ;

// A module is made of many of these.
// A circuitDeclaration is the keyword circuit, followed by an identifier
// and, optionally, a list of inputs. The body of the declaration is a set
// of assignments, followed by an output statement and the End keyword.
circuitDeclaration
    : Circuit Identifier (LeftParen identifierList? RightParen)? (assignment)* outStatement End
    ;

// Simple assignment construction. A list of identifiers, =, and an expression list.
// There should be at least as many entries in the expressionList as in the identifier
// list.
assignment
    : identifierList Assign expressionList
    ;

// The word 'out' followed by a list of expressions to act as the outputs of the circuit.
outStatement : Out expressionList ;

// A comma-separated list of identifiers (at least one)
identifierList
    : Identifier
    | identifierList ',' Identifier
    ;

// A comma-separated list of expressions (at least one)
expressionList
    : booleanExpression
    | expressionList ',' booleanExpression
    ;

// A call to evaluate a circuit with a set of parameters.
circuitCall
    : Identifier LeftParen expressionList? RightParen
    ;

// A factor that can be either a call to a circuit, an identifier to be evaluated,
// a literal boolean value (either the keyword or a 0/1), or a parenthesized
// boolean expression
booleanFactor
    : circuitCall
    | Identifier
    | BooleanValue
    | '(' booleanExpression ')'
    ;

// Gramatical structure to allow for multiple post-nots. 1'' == 1
booleanPostNot
    : booleanFactor
    | booleanPostNot PostNot
    ;

// Gramatical structure to allow for multiple pre-nots not not 1 == 1
booleanPreNot
    : booleanPostNot
    | Not booleanPreNot
    ;

// Gramatical structure for the Or-Nor precedence level. (above pre/postfix nots)
booleanOr
    : booleanPreNot
    | booleanPreNot Or booleanPreNot
    | booleanPreNot Nor booleanFactor
    ;

// Gramatical structure for the Xor-XNor precedence level (above or)
booleanXor
    : booleanOr
    | booleanOr Xor booleanOr
    | booleanOr XNor booleanOr
    ;

// Gramatical structure for the And/Nand precedence level (above xor)
// The overall expression structure
booleanExpression
    : booleanXor
    | booleanXor And booleanXor
    | booleanXor NAnd booleanXor
    ;

/***** Lexical Constants ******/

// Keywords
Circuit: 'circuit';
Out: 'out' ;
End: 'end' ;

// Operators
And: 'and' | '*' ;
Or: 'or' | '+' ;
Not: 'not' | '-' ;
PostNot: '\'' ;
Xor: 'xor' | '^' ;
NAnd: 'nand' ;
Nor: 'nor' ;
XNor: 'xnor' ;

// Syntactical tokens
Assign: '=' ;
LeftParen : '(' ;
RightParen : ')' ;
LeftBracket : '[' ;
RightBracket : ']' ;

// Raw boolean value
BooleanValue
    : 'true'
    | 'false'
    | '1'
    | '0'
    ;

// Identifiers like C/C++/Java.
Identifier
    : [a-zA-Z_][a-zA-Z0-9_]*
    ;

// Skip whitespace, newlines, and comments.
Whitespace
    : [ \t]+
      -> skip
    ;

Newline
    : ( '\r' '\n'?
      | '\n'
      ) -> skip
    ;

LineComment
    : '#' ~[\r\n]*
      -> skip
    ;