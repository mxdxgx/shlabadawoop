export class PrintUtils {
  private static MAX_WIDTH: number = 50;

  public static createBoundary(fileName: string) {
    const padding = Math.max(PrintUtils.MAX_WIDTH - fileName.length - 2, 0);
    const leftPadding = Math.floor(padding / 2);
    const rightPadding = padding - leftPadding;
    return (
      '#' +
      ' '.repeat(leftPadding) +
      ' ' +
      fileName +
      ' ' +
      ' '.repeat(rightPadding) +
      '#'
    );
  }
}
